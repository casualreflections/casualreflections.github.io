require 'RMagick'
require 'nokogiri'
include Magick

module Jekyll

  class SlideshowFile < StaticFile
      # Obtain destination path.
      #   +dest+ is the String path to the destination dir
      #
      # Returns destination file path.
      def destination(dest)
        File.join(dest, @dir, @name.sub(/\.(png|jpg)$/i, '-thumb.\1'))
      end

      # Creates the thumbnail for the image
      #   +dest+ is the String path to the destination dir
      #
      # Returns false if the file was not modified since last time (no-op).
      def write(dest)
        dest_path = destination(dest)
        return false if File.exist? dest_path and !modified?
        @@mtimes[path] = mtime

        FileUtils.mkdir_p(File.dirname(dest_path))
        begin
          content = Magick::Image::read(path).first
          thumb = content.resize_to_fill(100, 100)
          thumb.write dest_path
        rescue => e
          STDERR.puts "ImageMagick exception: #{e.message}"
        end

        true
      end
  end

  class ThumbGenerator < Generator
    safe true


    def generate(site)
      # go through all the images in the site, generate thumbnails for each one

      # if we don't have values set for thumbnails, use a sensible default
      if Jekyll.configuration({}).has_key?('slideshow')
        config = Jekyll.configuration({})['slideshow']
      else 
        config = Hash["width", 100, "height", 100]
      end
      to_thumb = Array.new
      # create a list of images to be thumbed
      # avoids problem with running over and over the old thumb
      site.static_files.clone.each do |sf|
        if (File.extname(sf.path).downcase == ('.jpg' || '.png')) && (!File.basename(sf.path).include? "-thumb")
            name = File.basename(sf.path)
            destination = File.dirname(sf.path).sub(site.source, '')
            site.static_files << SlideshowFile.new(site, site.source, destination, name)
        end
      end
    end
  end

end
