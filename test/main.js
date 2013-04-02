var commontask = require('../tasks/task-async-common')

var cssmin = require('ycssmin').cssmin;

cssmin('div{color:red;}')