// const redirectUrls = [
//   "opera://startpage/",
//   "browser://startpage/",
//   "chrome://startpage/",
//   "chrome://startpageshared/",
// ];
//
// chrome.tabs.onCreated.addListener((tab) => {
//   console.log("onCreated", tab);
//   if (redirectUrls.includes(tab.url || tab.pendingUrl || "")) {
//     console.log("onCreated inside", tab.id);
//     chrome.tabs.update(tab.id as number, {
//       url: "index.html",
//     });
//   }
// });
