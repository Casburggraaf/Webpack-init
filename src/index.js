if (process.env.NODE_ENV !== 'production') {
    require('file-loader!./index.html')
}

import css from './index.scss';
