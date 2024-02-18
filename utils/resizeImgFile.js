const resizeImgFile = (e, setImgSrc) => {
  let ResizeImg = null;

  let settings = {
    max_width: 1000,
    max_height: 1000,
    quality: 1,
    do_not_resize: [],
  };

  const originalFile = e.target.files[0];
  var reader = new FileReader();

  reader.onload = function (e) {
    var img = document.createElement("img");
    var canvas = document.createElement("canvas");

    img.src = e.target.result;
    img.onload = function () {
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      if (img.width < settings.max_width && img.height < settings.max_height) {
        // Resize not required
        setImgSrc(e.target.result);
        return;
      }

      const ratio = Math.min(
        settings.max_width / img.width,
        settings.max_height / img.height
      );
      const width = Math.round(img.width * ratio);
      const height = Math.round(img.height * ratio);

      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      ResizeImg = canvas.toDataURL("image/jpeg");
      setImgSrc(ResizeImg);
    };
  };

  reader.readAsDataURL(originalFile);
  return this;
};

module.exports.resizeImgFile = resizeImgFile;
