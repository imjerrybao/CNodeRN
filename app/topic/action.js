'use strict'

import {
    REQUEST_TOPICS,RESPONSE_TOPICS,
    REQUEST_TOPIC,RESPONSE_TOPIC,
    CHANGE_CATEGORY,FILTER_TOPICS,
    START_SAVEREPLY,FINISH_SAVEREPLY,
    START_SAVETOPIC,FINISH_SAVETOPIC,
    START_TOGGLEAGREE,FINISH_TOGGLEAGREE,
    START_TOGGLECOLLECT,FINISH_TOGGLECOLLECT
} from "./constant"

import api from "../lib/api"
import request from "../lib/request"

function requestTopics(category,pageIndex) {
    return {
        type:REQUEST_TOPICS,
        category,pageIndex
    }
}

function responseTopics(ret,category,pageIndex) {
    return {
        type:RESPONSE_TOPICS,
        ret,
        category,pageIndex
    }
}

export function fetchTopics(category="",pageIndex=1,pageSize=10) {
    return (dispatch)=>{
        dispatch(requestTopics(category,pageIndex))
        fetch(`${api.topics}?tab=${category}&page=${pageIndex}&limit=${pageSize}`).then(ret=>ret.json())
        .then((ret)=>{
            dispatch(responseTopics(ret,category,pageIndex))
        })
    }
}

export function changeCategory(category){
    return {
        type:CHANGE_CATEGORY,
        category
    }
}

export function filterTopics(keyword){
    return {
        type:FILTER_TOPICS,
        keyword
    }   
}


function requestTopic(id) {
    return {
        type:REQUEST_TOPIC,
        id
    }
}

function responseTopic(ret,id) {
    return {
        type:RESPONSE_TOPIC,
        ret,
        id
    }
}

export function fetchTopic(id) {
    return (dispatch)=>{
        dispatch(requestTopic(id))
        fetch(`${api.topic}/${id}`).then(ret=>ret.json())
        .then((ret)=>{
            dispatch(responseTopic(ret,id))
        })
    }
}

function startSaveReply(){
    return {
        type:START_SAVEREPLY
    }
}

function finishSaveReply(ret){
    return {
        type:FINISH_SAVEREPLY,
        ret
    }
}

export function saveReply(id,reply){
    return (dispatch)=>{
        dispatch(startSaveReply())
        request.post(`${api.reply2topic}/${id}/replies`,reply).then((ret)=>{
            dispatch(finishSaveReply(ret))
        })
    }
}

function startSaveTopic(){
    return {
        type:START_SAVETOPIC
    }
}

function finishSaveTopic(ret){
    return {
        type:FINISH_SAVETOPIC,
        ret,
        respondAt:Date.now()
    }
}

export function saveTopic(topic){
    return dispatch=>{
        dispatch(startSaveTopic())
        request.post(`${api.saveTopic}`,topic).then((ret)=>{
            dispatch(finishSaveTopic(ret))
        })
    }
}

function startToggleCollect(){
    return {
        type:START_TOGGLECOLLECT
    }
}

function finishToggleCollect(ret){
    return {
        type:FINISH_TOGGLECOLLECT,
        ret,
        respondAt:Date.now()
    }
}

export function toggleCollect(topicID,accessToken,isCollected=true){
    return dispatch=>{
        dispatch(startToggleCollect())
        request.post(`${isCollected?api.addCollect:api.delCollect}`,{
            accesstoken:accessToken,
            topic_id:topicID
        }).then((ret)=>{
            dispatch(finishToggleCollect(ret))
        })
    }
}

function startToggleAgree(){
    return {
        type:START_TOGGLEAGREE
    }
}

function finishToggleAgree(ret){
    return {
        type:FINISH_TOGGLEAGREE,
        ret,
        respondAt:Date.now()
    }
}

export function toggleAgree(replyID,accessToken){
    return dispatch=>{
        dispatch(startToggleAgree())
        request.post(`${api.agreeReply}/${replyID}/ups`,{
            accesstoken:accessToken
        }).then((ret)=>{
            dispatch(finishToggleAgree(ret))
        })
    }
}