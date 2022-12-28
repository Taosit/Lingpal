"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/login";
exports.ids = ["pages/api/login"];
exports.modules = {

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "cookie":
/*!*************************!*\
  !*** external "cookie" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("cookie");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "(api)/./db/connect.js":
/*!***********************!*\
  !*** ./db/connect.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"connectToDB\": () => (/* binding */ connectToDB)\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n\nglobal.mongo = global.mongo || {};\nconst connectToDB = async ()=>{\n    if (!global.mongo.client) {\n        console.log(\"no mongo client\");\n        global.mongo.client = new mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient(process.env.DATABASE_URI, {\n            useNewUrlParser: true,\n            useUnifiedTopology: true,\n            connectTimeoutMS: 10000\n        });\n        console.log(\"connecting to DB\");\n        await global.mongo.client.connect();\n        console.log(\"connected to DB\");\n    }\n    const db = global.mongo.client.db(\"lingpal\");\n    return {\n        db,\n        dbClient: global.mongo.client\n    };\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9kYi9jb25uZWN0LmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFxQztBQUVyQ0MsT0FBT0MsS0FBSyxHQUFHRCxPQUFPQyxLQUFLLElBQUksQ0FBQztBQUV6QixNQUFNQyxjQUFjLFVBQVk7SUFDckMsSUFBSSxDQUFDRixPQUFPQyxLQUFLLENBQUNFLE1BQU0sRUFBRTtRQUN4QkMsUUFBUUMsR0FBRyxDQUFDO1FBQ1pMLE9BQU9DLEtBQUssQ0FBQ0UsTUFBTSxHQUFHLElBQUlKLGdEQUFXQSxDQUFDTyxRQUFRQyxHQUFHLENBQUNDLFlBQVksRUFBRTtZQUM5REMsaUJBQWlCLElBQUk7WUFDckJDLG9CQUFvQixJQUFJO1lBQ3hCQyxrQkFBa0I7UUFDcEI7UUFFQVAsUUFBUUMsR0FBRyxDQUFDO1FBQ1osTUFBTUwsT0FBT0MsS0FBSyxDQUFDRSxNQUFNLENBQUNTLE9BQU87UUFDakNSLFFBQVFDLEdBQUcsQ0FBQztJQUNkLENBQUM7SUFFRCxNQUFNUSxLQUFLYixPQUFPQyxLQUFLLENBQUNFLE1BQU0sQ0FBQ1UsRUFBRSxDQUFDO0lBRWxDLE9BQU87UUFBRUE7UUFBSUMsVUFBVWQsT0FBT0MsS0FBSyxDQUFDRSxNQUFNO0lBQUM7QUFDN0MsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dvcmQtZ2FtZS8uL2RiL2Nvbm5lY3QuanM/Yzc0NiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb25nb0NsaWVudCB9IGZyb20gJ21vbmdvZGInXHJcblxyXG5nbG9iYWwubW9uZ28gPSBnbG9iYWwubW9uZ28gfHwge31cclxuXHJcbmV4cG9ydCBjb25zdCBjb25uZWN0VG9EQiA9IGFzeW5jICgpID0+IHtcclxuICBpZiAoIWdsb2JhbC5tb25nby5jbGllbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwibm8gbW9uZ28gY2xpZW50XCIpXHJcbiAgICBnbG9iYWwubW9uZ28uY2xpZW50ID0gbmV3IE1vbmdvQ2xpZW50KHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSSSwge1xyXG4gICAgICB1c2VOZXdVcmxQYXJzZXI6IHRydWUsXHJcbiAgICAgIHVzZVVuaWZpZWRUb3BvbG9neTogdHJ1ZSxcclxuICAgICAgY29ubmVjdFRpbWVvdXRNUzogMTAwMDAsXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdjb25uZWN0aW5nIHRvIERCJylcclxuICAgIGF3YWl0IGdsb2JhbC5tb25nby5jbGllbnQuY29ubmVjdCgpXHJcbiAgICBjb25zb2xlLmxvZygnY29ubmVjdGVkIHRvIERCJylcclxuICB9XHJcblxyXG4gIGNvbnN0IGRiID0gZ2xvYmFsLm1vbmdvLmNsaWVudC5kYignbGluZ3BhbCcpXHJcblxyXG4gIHJldHVybiB7IGRiLCBkYkNsaWVudDogZ2xvYmFsLm1vbmdvLmNsaWVudCB9XHJcbn0iXSwibmFtZXMiOlsiTW9uZ29DbGllbnQiLCJnbG9iYWwiLCJtb25nbyIsImNvbm5lY3RUb0RCIiwiY2xpZW50IiwiY29uc29sZSIsImxvZyIsInByb2Nlc3MiLCJlbnYiLCJEQVRBQkFTRV9VUkkiLCJ1c2VOZXdVcmxQYXJzZXIiLCJ1c2VVbmlmaWVkVG9wb2xvZ3kiLCJjb25uZWN0VGltZW91dE1TIiwiY29ubmVjdCIsImRiIiwiZGJDbGllbnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./db/connect.js\n");

/***/ }),

/***/ "(api)/./pages/api/login.js":
/*!****************************!*\
  !*** ./pages/api/login.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cookie */ \"cookie\");\n/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cookie__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _db_connect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../db/connect */ \"(api)/./db/connect.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async (req, res)=>{\n    const { email , password  } = req.body;\n    if (!email || !password) {\n        return res.status(400).json({\n            message: \"Username and password must be filled\"\n        });\n    }\n    const { db  } = await (0,_db_connect__WEBPACK_IMPORTED_MODULE_3__.connectToDB)();\n    const user = await db.collection(\"users\").findOne({\n        email: email\n    });\n    const match = await bcrypt__WEBPACK_IMPORTED_MODULE_0___default().compare(password, user?.password || \"0\");\n    if (!user || !match) {\n        return res.status(401).json({\n            message: \"Incorrect credentials\"\n        });\n    }\n    const { refreshToken , password: databasePassword , ...userCopy } = user;\n    const accessToken = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().sign({\n        email: email\n    }, process.env.ACCESS_TOKEN_SECRET, {\n        expiresIn: \"2h\"\n    });\n    const newRefreshToken = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().sign({\n        email: email\n    }, process.env.REFRESH_TOKEN_SECRET, {\n        expiresIn: \"1d\"\n    });\n    await db.collection(\"users\").updateOne({\n        email\n    }, {\n        $set: {\n            refreshToken: newRefreshToken\n        }\n    });\n    res.setHeader(\"Set-Cookie\", cookie__WEBPACK_IMPORTED_MODULE_2___default().serialize(\"jwt\", newRefreshToken, {\n        httpOnly: true,\n        maxAge: 8 * 60 * 60,\n        path: \"/\",\n        sameSite: \"lax\",\n        secure: \"development\" === \"production\"\n    }));\n    return res.status(200).json({\n        accessToken,\n        user: userCopy\n    });\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvbG9naW4uanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBMkI7QUFDRztBQUNIO0FBQ29CO0FBRS9DLGlFQUFlLE9BQU9JLEtBQUtDLE1BQVE7SUFDakMsTUFBTSxFQUFFQyxNQUFLLEVBQUVDLFNBQVEsRUFBRSxHQUFHSCxJQUFJSSxJQUFJO0lBQ3JDLElBQUksQ0FBQ0YsU0FBUyxDQUFDQyxVQUFVO1FBQ3RCLE9BQU9GLElBQUlJLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUMsU0FBUztRQUF1QztJQUNoRixDQUFDO0lBQ0QsTUFBTSxFQUFFQyxHQUFFLEVBQUUsR0FBRyxNQUFNVCx3REFBV0E7SUFDaEMsTUFBTVUsT0FBTyxNQUFNRCxHQUFHRSxVQUFVLENBQUMsU0FBU0MsT0FBTyxDQUFDO1FBQUVULE9BQU9BO0lBQU07SUFDbEUsTUFBTVUsUUFBUSxNQUFNaEIscURBQWMsQ0FBQ08sVUFBVU0sTUFBTU4sWUFBWTtJQUM5RCxJQUFJLENBQUNNLFFBQVEsQ0FBQ0csT0FBTztRQUNuQixPQUFPWCxJQUFJSSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQUVDLFNBQVM7UUFBd0I7SUFDakUsQ0FBQztJQUNGLE1BQU0sRUFBQ08sYUFBWSxFQUFFWCxVQUFTWSxpQkFBZ0IsRUFBRSxHQUFHQyxVQUFTLEdBQUdQO0lBRS9ELE1BQU1RLGNBQWNwQix3REFBUSxDQUMzQjtRQUFFSyxPQUFPQTtJQUFNLEdBQ2ZpQixRQUFRQyxHQUFHLENBQUNDLG1CQUFtQixFQUMvQjtRQUFFQyxXQUFXO0lBQUs7SUFFbkIsTUFBTUMsa0JBQWtCMUIsd0RBQVEsQ0FDL0I7UUFBRUssT0FBT0E7SUFBTSxHQUNmaUIsUUFBUUMsR0FBRyxDQUFDSSxvQkFBb0IsRUFDaEM7UUFBRUYsV0FBVztJQUFLO0lBRWxCLE1BQU1kLEdBQUdFLFVBQVUsQ0FBQyxTQUFTZSxTQUFTLENBQUM7UUFBRXZCO0lBQU0sR0FBRztRQUFFd0IsTUFBTTtZQUFFWixjQUFjUztRQUFnQjtJQUFFO0lBQzVGdEIsSUFBSTBCLFNBQVMsQ0FDWCxjQUNBN0IsdURBQWdCLENBQUMsT0FBT3lCLGlCQUFpQjtRQUN2Q00sVUFBVSxJQUFJO1FBQ2RDLFFBQVEsSUFBSSxLQUFLO1FBQ2pCQyxNQUFNO1FBQ05DLFVBQVU7UUFDVkMsUUFBUWQsa0JBQXlCO0lBQ25DO0lBRUgsT0FBT2xCLElBQUlJLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7UUFBRVc7UUFBYVIsTUFBTU87SUFBUztBQUMzRCxHQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd29yZC1nYW1lLy4vcGFnZXMvYXBpL2xvZ2luLmpzP2FlODgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHQnXHJcbmltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJ1xyXG5pbXBvcnQgY29va2llIGZyb20gJ2Nvb2tpZSdcclxuaW1wb3J0IHsgY29ubmVjdFRvREIgfSBmcm9tICcuLi8uLi9kYi9jb25uZWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkIH0gPSByZXEuYm9keTtcclxuXHRpZiAoIWVtYWlsIHx8ICFwYXNzd29yZCkge1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogJ1VzZXJuYW1lIGFuZCBwYXNzd29yZCBtdXN0IGJlIGZpbGxlZCcgfSk7XHJcbiAgfVxyXG4gIGNvbnN0IHsgZGIgfSA9IGF3YWl0IGNvbm5lY3RUb0RCKClcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcnMnKS5maW5kT25lKHsgZW1haWw6IGVtYWlsIH0pXHJcblx0Y29uc3QgbWF0Y2ggPSBhd2FpdCBiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgdXNlcj8ucGFzc3dvcmQgfHwgXCIwXCIpO1xyXG4gIGlmICghdXNlciB8fCAhbWF0Y2gpIHtcclxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7IG1lc3NhZ2U6ICdJbmNvcnJlY3QgY3JlZGVudGlhbHMnIH0pO1xyXG4gIH1cclxuXHRjb25zdCB7cmVmcmVzaFRva2VuLCBwYXNzd29yZDpkYXRhYmFzZVBhc3N3b3JkLCAuLi51c2VyQ29weX0gPSB1c2VyO1xyXG5cclxuXHRjb25zdCBhY2Nlc3NUb2tlbiA9IGp3dC5zaWduKFxyXG5cdFx0eyBlbWFpbDogZW1haWwgfSxcclxuXHRcdHByb2Nlc3MuZW52LkFDQ0VTU19UT0tFTl9TRUNSRVQsXHJcblx0XHR7IGV4cGlyZXNJbjogXCIyaFwiIH1cclxuXHQpO1xyXG5cdGNvbnN0IG5ld1JlZnJlc2hUb2tlbiA9IGp3dC5zaWduKFxyXG5cdFx0eyBlbWFpbDogZW1haWwgfSxcclxuXHRcdHByb2Nlc3MuZW52LlJFRlJFU0hfVE9LRU5fU0VDUkVULFxyXG5cdFx0eyBleHBpcmVzSW46IFwiMWRcIiB9XHJcblx0KTtcclxuICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VycycpLnVwZGF0ZU9uZSh7IGVtYWlsIH0sIHsgJHNldDogeyByZWZyZXNoVG9rZW46IG5ld1JlZnJlc2hUb2tlbiB9IH0pXHJcbiAgcmVzLnNldEhlYWRlcihcclxuICAgICdTZXQtQ29va2llJyxcclxuICAgIGNvb2tpZS5zZXJpYWxpemUoJ2p3dCcsIG5ld1JlZnJlc2hUb2tlbiwge1xyXG4gICAgICBodHRwT25seTogdHJ1ZSxcclxuICAgICAgbWF4QWdlOiA4ICogNjAgKiA2MCxcclxuICAgICAgcGF0aDogJy8nLFxyXG4gICAgICBzYW1lU2l0ZTogJ2xheCcsXHJcbiAgICAgIHNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyxcclxuICAgIH0pXHJcbiAgKVxyXG5cdHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IGFjY2Vzc1Rva2VuLCB1c2VyOiB1c2VyQ29weSB9KTtcclxufSJdLCJuYW1lcyI6WyJiY3J5cHQiLCJqd3QiLCJjb29raWUiLCJjb25uZWN0VG9EQiIsInJlcSIsInJlcyIsImVtYWlsIiwicGFzc3dvcmQiLCJib2R5Iiwic3RhdHVzIiwianNvbiIsIm1lc3NhZ2UiLCJkYiIsInVzZXIiLCJjb2xsZWN0aW9uIiwiZmluZE9uZSIsIm1hdGNoIiwiY29tcGFyZSIsInJlZnJlc2hUb2tlbiIsImRhdGFiYXNlUGFzc3dvcmQiLCJ1c2VyQ29weSIsImFjY2Vzc1Rva2VuIiwic2lnbiIsInByb2Nlc3MiLCJlbnYiLCJBQ0NFU1NfVE9LRU5fU0VDUkVUIiwiZXhwaXJlc0luIiwibmV3UmVmcmVzaFRva2VuIiwiUkVGUkVTSF9UT0tFTl9TRUNSRVQiLCJ1cGRhdGVPbmUiLCIkc2V0Iiwic2V0SGVhZGVyIiwic2VyaWFsaXplIiwiaHR0cE9ubHkiLCJtYXhBZ2UiLCJwYXRoIiwic2FtZVNpdGUiLCJzZWN1cmUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/login.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/login.js"));
module.exports = __webpack_exports__;

})();