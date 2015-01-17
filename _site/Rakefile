require "rubygems"
require "tmpdir"

require "bundler/setup"
require "jekyll"


# Change your GitHub reponame
GITHUB_REPONAME = "/bhuvanrawal/bhuvanrawal.github.io"


desc "Generate blog files"
task :generate do
  Jekyll::Site.new(Jekyll.configuration({
    "source"      => ".",
    "destination" => "_site"
  })).process
end


desc "Generate and publish blog to gh-pages"
task :publish => [:generate] do

    cp_r "_site/.", "tmp"

    pwd = Dir.pwd
    Dir.chdir "tmp"

    system "git add ."
    message = "Site updated at #{Time.now.utc}"
    system "git commit -m #{message.inspect}"
    system "git push origin master --force"

    Dir.chdir pwd
 
end

