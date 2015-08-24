# draw&sup2;
##### A multi-user web app to collectively create continuous digital drawings

draw&sup2; was my project submission in Spring 2012 for 4002-546 Web Client Server Programming at Rochester Institute of Technology. You can view the project requirements via [546_PROJECT.pdf](https://github.com/matthewtraughber/draw-squared/blob/master/546_PROJECT.pdf). It uses [Meteor](https://www.meteor.com/) (including MongoDB) as the platform and [D3.js](http://d3js.org/) for drawing generation. Users (after registering) can create private drawing rooms as well as chat with other users. I've open-sourced draw&sup2; for future students to reference as an example (and who knows, perhaps someone will pick it up and develop further).

## Setup
Since draw&sup2; was created using a now-deprecated version of [Meteor](https://www.meteor.com/) and [Meteorite](https://oortcloud.github.io/meteorite/), you'll have to follow these specific instructions to get it running.

##### Install Meteorite
``` sudo -H npm install -g meteorite ```

##### Within project folder, run Meteorite (it will install other necessary packages)
``` sudo mrt ```

## DEMO
http://draw-squared.meteor.com/

## License
Released under the [MIT license](http://opensource.org/licenses/MIT)
