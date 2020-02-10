const {MongoClient} = require('mongodb');

async function main(){
    
    const uri="mongodb+srv://dbCorey:MVDhmYhNQkp2y8T@cluster0-ymebw.mongodb.net/sottlab?retryWrites=true&w=majority"
   
    const client = new MongoClient(uri);

    try {
        
        await client.connect();

   
        await createListing(client,
            {
               name: "New sample"
            }
        );
  
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function createListing(client, newListing){
    const result = await client.db("sample").collection("sottlab").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}