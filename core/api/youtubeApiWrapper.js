const logger = require('loglevel');
const api = require('../../config/api');
const {google} = require('googleapis');

const youtube = google.youtube(api.youtube.config);

// logger.setLevel('info', false);

async function getVideo(strain)
{
    return new Promise((resolve, reject) => {
        let options = api.youtube.searchOptions;
        var qString = '';
        for (let i = 0; i < api.youtube.keywords.length; i++)
        {
            if (i == 0)
            {
                qString += api.youtube.keywords[i];
                qString += ' ' + strain;
            }
            else
            {
                qString += ' ' + api.youtube.keywords[i];
            }
        }
        options.q = qString;
        logger.info(options);
        youtube.search.list(options, function(err, data){
            if (!err)
            {
                // logger.info(JSON.stringify(data, null, 4));
                let videoId = data.data.items[0].id.videoId;
                logger.info(videoId);
                let embeddedURL = api.youtube.embeddedBaseURL + videoId;
                logger.info(embeddedURL);
                resolve({video: embeddedURL});
            }
            else
            {
                logger.error(err);
                resolve({video: null});
            }
        });
    })
}

module.exports.getStrainVideo = getVideo;

// Testing
// getVideo("ak-47");