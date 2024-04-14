const fs = require('fs');

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
export default function handler(req, res) {
        
        const client = new textToSpeech.TextToSpeechClient();

// The text to synthesize
const text = req.body.text;
        const request = {
                input: {text: text},
                // Select the language and SSML Voice Gender (optional)
                voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
                // Select the type of audio encoding
                audioConfig: {audioEncoding: 'MP3'},
              };
              
              // Performs the Text-to-Speech request
              client.synthesizeSpeech(request, (err, response) => {
                if (err) {
                        return res.json({ message: err, error: true });
                        
  }
              
                // Write the binary audio content to a local file
                fs.writeFile('output.mp3', response.audioContent, 'binary', err => {
                  if (err) {
                        return res.json({ message: err, error: true });
                    
                  }
                  return res.json({ message: 'Audio content written to file: output.mp3', error: false });
                 // console.log('Audio content written to file: output.mp3');
                });
              });
      }