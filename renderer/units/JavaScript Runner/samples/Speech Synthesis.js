let voices = window.speechSynthesis.getVoices ();
let autralianVoice = null;
for (let voice of voices)
{
    if ((voice.lang === 'en-AU') && (voice.name === 'Karen'))
    {
        autralianVoice = voice;
        break;
    }
}
let message = new SpeechSynthesisUtterance ();
if (autralianVoice)
{
    message.voice = autralianVoice;
    message.text = "Hello, Electron! My name is Karen, I'm an Australian voice.";
}
else
{
    message.lang = 'en-GB';
    message.text = "Hello, Electron! I'm supposed to be a British English voice.";
}
window.speechSynthesis.speak (message);
