// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig:   {
    apiKey: "AIzaSyC2P1UtsvR8SY2C-4SsMFZgIsoI24JL3uI",
    authDomain: "auxesis-financial-services.firebaseapp.com",
    databaseURL: "https://auxesis-financial-services.firebaseio.com",
    projectId: "auxesis-financial-services",
    storageBucket: "auxesis-financial-services.appspot.com",
    messagingSenderId: "162104209831"
  }
};
