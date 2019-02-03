if(process.env.NODE_env === 'production'){
    module.exports = {mongoURI: 'mongodb://oleg:oleg11@ds055822.mlab.com:55822/vidjot'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}