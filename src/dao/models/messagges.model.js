import mongoose from "mongoose";

const messaggeCollection = 'messages';

const messagesSchema = new mongoose.Schema({

})



export const messagesModel = mongoose.model(messaggeCollection, messagesSchema);