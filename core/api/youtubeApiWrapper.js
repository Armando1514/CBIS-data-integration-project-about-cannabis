const logger = require('loglevel');
const api = require('../../config/api');
const {google} = require('googleapis');

const youtube = google.youtube(api.youtube.config);

// logger.setLevel('info', false);

async function getVideo(strain)
{
    
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
        try
        {
            let result = await youtube.search.list(options);
            // logger.info(JSON.stringify(data, null, 4));
            if (result.data.items[0] === undefined)
            {
                return {video: null};
            }
            let videoId = result.data.items[0].id.videoId;
            let embeddedURL = api.youtube.embeddedBaseURL + videoId;
            return {video: embeddedURL};
        }
        catch (err)
        {
            return {video: null};
        }
    
}

module.exports.getStrainVideo = getVideo;

// Testing
// getVideo("ak-47");