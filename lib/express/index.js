import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import config from '../../config/project.config';

export function index(app) {

  return new Promise((resolve, reject) => {

    app.use(bodyParser.json({limit: '5mb'}));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(compression());
    app.use(helmet());
    app.use(cors({origin: true, credentials: true}));

    // Passport Initialization
    // app.use(passport.initialize());
    // app.use(passport.session());

    // logging with Morgan
    if (config.logging) {
      app.use(morgan('dev'));
    }

    // ------------------------------------
    // Environment Configuration
    // ------------------------------------
    const __DEV__ = config.env === 'development';
    const __TEST__ = config.env === 'test';
    const __PROD__ = config.env === 'production';


    resolve();

  })

}
