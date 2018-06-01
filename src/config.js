const config = {
  baseUrl: process.env.NODE_ENV === 'development' ? 'http://172.16.103.249:8062' : (typeof(hostId) == "undefined" || hostId == "") ? "http://172.16.103.249:8062" : hostId,
  //baseUrl: process.env.NODE_ENV === 'development' ? 'http://10.52.30.155:8080' : 'http://10.52.30.43',
  isDevEnv: process.env.NODE_ENV === 'development' ? true : false
};

export default config
