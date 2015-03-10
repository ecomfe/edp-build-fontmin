# edp-build-fontmin

> edp-build with fontmin

## Usage

`edp-build-config.js`:

```
var FontProcessor = require('edp-build-fontmin');

exports.getProcessors = function () {

    var fontProcessor = new FontProcessor({
        files: [ '*.ttf' ],                     // 字体文件
        entryFiles: [ '*.html' ],               // 引用字体的网页，用来扫描所需字型
        text: '他夏了夏天',                      // 人肉配置所需字型
        chineseOnly: true,                      // 只取中文字型，忽略 数字、英文、标点
    });

    return {
        'default': [fontProcessor]
    };

});
```

## Related

- [edp-build-fontmin-demo](https://github.com/junmer/edp-build-fontmin-demo)
