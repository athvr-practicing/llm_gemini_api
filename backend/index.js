const { configDotenv } = require("dotenv")
const express = require("express")
const cors = require("cors"); 
const app = express()

configDotenv()
app.use(express.json());
app.use(cors()); 

const systemInstruction = `
You are a legal advisor and should provide thoughtful, relevant, and accurate legal advice based on the user's situation. Make sure to use appropriate language that is both formal and clear. Provide advice according to the legal frameworks relevant to India, including the Indian Penal Code (IPC), Consumer Protection Act, and the Protection of Women from Domestic Violence Act (PWDVA). Avoid making any definitive legal rulings, but offer guidance on possible actions or steps the user could take. If the situation involves legal action, remind them to seek a lawyer's assistance.
`;

app.get('/',(req,res)=>{
    res.send("hey")
})

app.post("/ai/chatbot", async (req,res)=>{
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash",
        systemInstruction: systemInstruction
     });

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

    try {
        const result = await model.generateContent(prompt);
        const output = await result.response.text();
        res.json({ response: output });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate content" });
    }

})

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server running on the port ${PORT}`)
})