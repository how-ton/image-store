// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
const fs = require('fs');


ListFiles = async (bucketName) => {
    // Creates a client
    const storage = new Storage();
    const [files] = await storage.bucket(bucketName).getFiles();

    console.log('Files:');
    files.forEach(file => {
        console.log(file.name);
    });
}

 uploadFile = async (bucketName, filename) => {  
    // Creates a client
    const storage = new Storage();
  
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // const bucketName = 'Name of a bucket, e.g. my-bucket';
    // const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';
  
    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filename, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
    });
  
    console.log(`${filename} uploaded to ${bucketName}.`);
    // [END storage_upload_file]
  }

iterateFolder = async (err, files) => {
    files.forEach(
        async file => await uploadFile(process.env.IMG_STORE_BUCKET_NAME, 
            process.env.IMG_STORE_UPLOAD_FOLDER + "/" + file))
}

main = async () => {
    const bucketName = process.env.IMG_STORE_BUCKET_NAME;
    
    ListFiles(bucketName)
    
    fs.readdir(process.env.IMG_STORE_UPLOAD_FOLDER, await iterateFolder)
   
    ListFiles(bucketName)
}
 
main()