import React , {useState,useEffect}from 'react'
import { useParams } from 'react-router-dom'
import { Editor } from '@monaco-editor/react'
import {
    Play,
    FileText,
    MessageSquare,
    Lightbulb,
    Bookmark,
    Share2,
    Clock,
    ChevronRight,
    BookOpen,
    Terminal,
    Code2,
    Users,
    ThumbsUp,
    Home,
  } from "lucide-react";
  import { useProblemStore } from '../store/useProblemStore';

const ProblemPage = () => {
    const {id} = useParams()
    const {getProblemById, problem , isProblemLoading} = useProblemStore();
    const [code,setCode] = useState("");
    const [activeTab,setActiveTab] = useState("description");
    const [selectedLanguage,setSelectedLanguage] = useState("javascript");
    const [isBookmarked,setIsBookmarked] = useState(false);
    const [testCases,setTestCases] = useState([]);

    useEffect(()=>{
        getProblemById(id)
    },[id])

    useEffect(()=>{
        if(problem){
            setCode(problem.codeSnippets?.[selectedLanguage]||submission?.sourceCode||"")
        }
    },[problem,selectedLanguage]);







  return (
    <div>
        helllo {
            JSON.stringify(problem)
        }
    </div>
  )
}

export default ProblemPage