var isMobile = {
  Android: function() {
    return /Android/i.test(navigator.userAgent);
  },
  BlackBerry: function() {
    return /BlackBerry/i.test(navigator.userAgent);
  },
  IOS: function() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  },
  Windows: function() {
    return /IEMobile/i.test(navigator.userAgent);
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
  }
};
