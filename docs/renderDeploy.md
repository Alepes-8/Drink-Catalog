# Render

Is a publicly available API host system in where I have deployed the Drink Catalog up to. This is so that it can be access anywhere and as well as show a real life sistastion in where I have deployed a working API to an external system. 

## Deploy

With the current setup with the api being stored on github, the project is utilising the github actions in order to do testing and deployment. To note, it does seperate tests for each pull request that is executed in a Feature branch. However, one doesn't want changes to be automaticly added just because, and neither at each and every pull request to a feature branch. This way the build will be unstable much more oftan and stop working. So rather, the deployment will occur only when all the changes are pushed into the main branch, and only when the main branches tests has successed. That way, if there are failiures, that will stop the deployment and create a safer envirnoment.

The **.github/workflows/deploy.yml** contains the nassusary steps for the deployument of the render.