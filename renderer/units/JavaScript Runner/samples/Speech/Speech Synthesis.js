// Speech Synthesis
let voices = window.speechSynthesis.getVoices ();
let australianVoice = null;
for (let voice of voices)
{
    if ((voice.lang === 'en-AU') && (voice.name === 'Karen'))
    {
        australianVoice = voice;
        break;
    }
}
let message = new SpeechSynthesisUtterance ();
if (australianVoice)
{
    message.voice = australianVoice;
    message.text = "Hello, Electron! My name is Karen, I'm an Australian voice.";
}
else
{
    message.lang = 'en-GB';
    message.text = "Hello, Electron! I'm supposed to be a British English voice.";
}
window.speechSynthesis.speak (message);
