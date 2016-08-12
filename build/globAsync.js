import g from 'glob';
export function glob(globRegex){
  return new Promise((resolve,reject)=>{
    g(globRegex,(err,files)=>{
      if(err)reject(err);
      resolve(files);
    });
  });
}
