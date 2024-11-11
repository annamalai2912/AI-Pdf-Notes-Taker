import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


//const pdfUrl='https://limitless-manatee-327.convex.cloud/api/storage/f8e352c3-4398-4cda-8cb0-5566fb5dc4a6'
export async function GET(req){
    // pdf load
    const reqUrl=req.url;
    const {searchParams}=new URL(reqUrl);
    const pdfUrl=searchParams.get('pdfUrl');
    console.log(pdfUrl);
    const response=await fetch(pdfUrl);
    const data=await response.blob();
    const loader=new WebPDFLoader(data);
    const docs=await loader.load();
    let pdfTextContent = '';
    docs.forEach(doc => {
        pdfTextContent=pdfTextContent + doc.pageContent+" " ;
    });
    // text split
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
      });
    const output = await splitter.createDocuments([pdfTextContent]);

    let splitterList=[];
    output.forEach(doc => {
        splitterList.push(doc.pageContent);
    });

    return NextResponse.json({result:splitterList})

    



}