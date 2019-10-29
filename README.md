# Cards Against Humanity Web App

Host and run your own Cards Against Humanity web game.

*Read this in other languages: [Português](https://github.com/btalanski/CartasContraAHumanidadeWeb/blob/master/README.pt-br.md).*

## About
This project is a simple study as how to implement a Node.js and Socket.io multiplayer game. React was used to build the UI for the client. This is a really simple implementation of both server, client and game logic. This is not a production ready software in any manner. No support is offered to fix bugs, code is made available "as is". Feel free to clone this repo and make your own customizations.

## To-dos:
This is a list of things I *want* to implement, but are out of the scope of this project for now:

#### Frontend
- [ ] Implement Redux
- [ ] Improve components code
- [ ] Improve the overall UI design
- [ ] Implement multiple card answers
- [ ] Implement chat component
- [ ] Improve error handling

#### Backend
- [ ] Improve server code (refactor)
- [ ] Improve game code (refactor)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
```
Node.js v10+ (LTS recommended)
```

### Installing

* Clone this repo
* Run `npm install` on the root folder

### Run the application
To start the server execute the following command:
```
npm start
```

To start webpack dev server:
```
npm run build
```

Access the application at `http://localhost:8080` or `http://localhost:9001` for the dev server

## Running the tests

No tests implemented.

## Deployment

You can use Google Cloud free tier to host the app and play with friends.

**Deploying to Google Cloud**

* Create a project on Google Cloud
* Setup the `gcloud` SDK on your computer
* Follow the commands below

List your `gcloud` projects:
```
gcloud projects list
```
Run the command to select the project you created for this app:
```
gcloud config set project `PROJECT_ID`
```
Deploy the app using the following command:
```
gcloud app deploy
```
## Built With

* [Socket.IO](https://socket.io)
* [Node.js](https://nodejs.org)
* [React](https://reactjs.org)
* [Webpack](https://webpack.js.org)

## Contributing
N/A

## Versioning

N/A

## Authors

* **Bruno Talanski** - *Initial work* - [Github](https://github.com/btalanski)

See also the list of [contributors](https://github.com/btalanski/CartasContraAHumanidadeWeb/) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
Cards Against Humanity is available for free under a Creative Commons license.
