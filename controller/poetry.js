module.exports.main = async function(ctx) {
    ctx.body = await ctx.render('poetry');
}
