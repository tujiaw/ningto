# sanjiadian.net

export default compose(
    withStyles(styles, {
        name: 'App',
    }),
    connect(),
)(AppFrame);
or you can do:

export default withStyles(styles)(connect(select))(Cart));

1.0版本