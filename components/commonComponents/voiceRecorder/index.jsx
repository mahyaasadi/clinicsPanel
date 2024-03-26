import * as React from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

const voiceRecorder = ({ SendAudioMessage }) => {
  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err) // onNotAllowedOrFound
  );

  const addAudioElement = (blob) => {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      SendAudioMessage(base64data);
    };

    // const url = URL.createObjectURL(blob);
    // const audio = document.createElement('audio');
    // audio.src = url;``
    // audio.controls = true;
    // document.body.appendChild(audio);
  };

  return (
    <AudioRecorder
      onRecordingComplete={(blob) => addAudioElement(blob)}
      recorderControls={recorderControls}
      showVisualizer={true}
      // downloadOnSavePress={true}
      // downloadFileExtension="mp3"
    />
  );
};

export default voiceRecorder;
