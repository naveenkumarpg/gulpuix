# gulpuix
gulpuix is scoffolding tool for the front-end developers to build web pages with ease.


##Tech task

1. Handlebars
2. SCSS
3. Bower
4. Jquery
5. browser-sync
6. Assemble
7. Surge

##How to use this scoffolding tool

####Installing Node
Install node.js from the official site

    https://nodejs.org/

####Installing scoffolding tool
gulpuix can be installed in following ways

    npm install gulpuix
OR    

    git clone https://github.com/naveenkumarpg/gulpuix.git

you can install gulpuix using either ways

after downloading gulpuix open same folder path in cmd 'npm install' to install dependencies to run gulpuix,

if bower gives a git error if you do direct install so give this command on your terminal

        git config --global url."https://".insteadOf git://

####Installing SASS
SASS Installation Now for sass we need to install ruby and its gems Download ruby from official site, While installing add it to the path Then install compass that is required to compile sass by giving

    gem install compass

####Installing Bower
Bower is a command line utility. Install it with npm.

     npm install -g bower
     bower install

####Installing surge
Installing and using surge for deployments, get more info on https://surge.sh/

        npm install --global surge
        
after installing surge, in terminal if you wan to deploy complete folder use

        surge

if you wan to part of the folder to deploy for our case its build folder.

    surge -p build 
    
Now your project folder is ready. You can commit this to your repo for others to use.
Install bower, git & grunt-cli globally before getting project dependencies.
