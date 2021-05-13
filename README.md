# PetriFact

PetriFact is a tool for modeling and controlling external systems built within [FlexFact](https://fgdes.tf.fau.de/flexfact.html). The application provides an interface that lets the user model a Petri Net, map FlexFact input and output events to it and then run a simulation that is capable of communicating with FlexFact, sending and receiving signals via the Modbus/TCP protocol.

### Download

https://github.com/gabrieltjunior/petrifact/releases

### Usage

First of all, you'll have to install FlexFact and have a system modeled and ready to be controlled. Then, you should download and install PetriFact within your system.

After that, execute the application. You will be prompted to create or load a new project. Click "Create new project". The application will ask you provide a configuration file. This is provided by FlexFact itself. Just navigate to "File > Export Modbus/TCP Configuration..." and save the file wherever you wish. Provide the file to PetriFact and then the canvas should be shown to you.

You are now free to model your Petri net. Just right click the empty canvas to get started by creating elements on screen.

After you're done, you can run the simulation mode, where PetriFact acts as a controller of FlexFact. To enable that, go to FlexFact, select "Simulation > Modbus" and then "Simulation > Start". Finally, you can simply click the "Run Mode" button in PetriFact to start the controlling the FlexFact model.

### For developers

#### Install

- **If you have installation or compilation issues with this project, please see [electron-react-boilerplate's debugging guide](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/400)**

First, clone the repo via git and install dependencies:

```bash
git clone https://github.com/gabrieltjunior/petrifact.git
cd petrifact
yarn
```

You might need to run `npm install` as well for now, this should be fixed on the next version

#### Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
yarn dev
```

#### Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

#### Maintainers

- [Gabriel Tiburski Júnior](https://github.com/gabrieltjunior)

#### License

MIT © [Gabriel Tiburski Júnior](https://github.com/gabrieltjunior)
