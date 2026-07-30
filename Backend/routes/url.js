import express from 'express';
import Url from '../models/Url.js'
import { nanoid } from 'nanoid';
 

const router = express.Router();
router.post("/shorten",async (req,res)=>{
    try{
        console.log(req.body);
        //const { originalURL } = req.body;
        /*let { originalURL } = req.body;

        if (!/^https?:\/\//i.test(originalURL)) {
            originalURL = "https://" + originalURL;
        }
        if(!originalURL){
            return  res.status(400).json({ error:"Original URL is required."});
        }

        try{
            new URL(originalURL);
        }catch{
            return  res.status(400).json({ error:"Invalid URL."});
        }*/
        let { originalURL } = req.body;

        if (!originalURL) {
            return res.status(400).json({
                error: "Original URL is required."
            });
        }

        originalURL = originalURL.trim();

        if (!/^https?:\/\//i.test(originalURL)) {
            originalURL = "https://" + originalURL;
        }

        try {
            new globalThis.URL(originalURL);
        } catch {
            return res.status(400).json({
                error: "Invalid URL."
            });
        }

        let shortId;
        let exists = true;
        while(exists){
            shortId = nanoid(7);
            exists = await Url.findOne({ shortId });
        }

        const url = await Url.create({
            shortId, originalURL
        });

        res.json({
            shortId : url.shortId,
            shortUrl : `${process.env.BASE_URL}/${url.shortId}`,
        })

    }catch(error){
        console.log(error);
        res.status(500).json({error: "Server error"});
    }
})

router.get("/:shortId", async (req,res) =>{
        try{
            const{shortId } = req.params;
            
            const url = await Url.findOne({shortId})
            if (!url) 
                return res.status(400).json({error: "URL not found"});

            url.clicks+=1;
            await url.save();

            return res.redirect(url.originalURL);


        }catch(error){
            console.log(error);
            res.status(500).json({ error: "Server Error"});
        }
})
/*router.get("/", (req, res) => {
    res.send("URL Shortener API is running");
});*/

export default router;