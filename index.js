/**
 * @file edp-build fontmin
 * @author junmer
 */

/* eslint-env node */

var extend = require('extend');
var path = require('path');
var Fontmin = require('fontmin');

/**
 * fontMinify 处理器
 *
 * @param  {FileObject}   file           处理器文件对象
 * @param  {processContext}   processContext 处理器上下文
 * @param  {Function} done           完成回调
 */
function fontMinify(file, processContext, done) {

    var text = this.text || '';

    var entryFiles = this.entryFiles;

    if (entryFiles) {

        var entryText = [];

        processContext
            .getFilesByPatterns(entryFiles)
            .forEach(function (entryFile) {
                entryText.push(entryFile.data);
            });

        text += entryText.join('');
    }

    var chineseOnly = this.chineseOnly;

    if (chineseOnly) {
        text = text.replace(/[^\u4e00-\u9fa5]/g, '');
    }

    var srcPath = file.path;
    var outputDir = processContext.outputDir;
    var destPath = path.dirname(file.outputPath);
    destPath = path.resolve(outputDir, destPath); // 获取目标地址，传入 fontmin.dest
    file.outputPath = null; // 清除 edp 构建结果

    var fontmin = new Fontmin()
        .src(srcPath)
        .use(Fontmin.glyph({
            text: text
        }))
        .use(Fontmin.ttf2eot())
        .use(Fontmin.ttf2woff())
        .use(Fontmin.ttf2svg())
        .dest(destPath);

    var me = this;

    fontmin.run(function (err, files, stream) {
        if (err) {
            me.log.error(err);
        }

        done();
    });
}

/**
 * fontProcessor 默认配置
 *
 * @type {Object}
 */
var fontProcessor = {
    files: ['*.ttf'],
    entryFiles: ['*.html'],
    text: '',
    chineseOnly: false,
    name: 'FontCompressor',
    process: fontMinify
};

/**
 * FontProcessor 构造函数
 *
 * @param {Object} opt 配置
 * @param {Array} opt.files 字体文件
 * @param {Array} opt.entryFiles 引用字体的网页，用来扫描所需字型
 * @param {string} opt.text 人肉配置所需字型
 * @param {boolean} opt.chineseOnly 只取中文字型，忽略 数字、英文、标点
 * @return {Object} FontProcessor instance
 */
function FontProcessor(opt) {
    return extend({}, fontProcessor, opt);
}

module.exports = exports = FontProcessor;
