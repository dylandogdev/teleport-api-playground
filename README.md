# This is a basic React frontent app as part of my application portfolio. 

The standard create-react-app commands apply here:

  `npm start`

runs in the dev env

  `npm run build`

creates a prod build with minified files in the build folder.

Since there was a time limit I tried to leave helpful notes in the code explaining where I cut corners to save time and what I would do differently in real life. In addition to that I would definitely add tests to something like this, with a focus on cleaning user input, handling unexpected responses, etc. A service worker registered for this app could also be an easy add-on since there are a finite number of choices in teh UA api and duplicate requests could easily be cached to save time and power - this is not a realtime db so it's a good candidate for that.

