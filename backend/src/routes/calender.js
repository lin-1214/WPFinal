import {EventModel, CalendarModel} from "../models/calender"

exports.createCalendarEvent = async (req, res) => {
    const body = req.body;
    const newEvent = await new EventModel({name: body.name, interval: body.interval,time: body.time, type: body.type, color: body.color, stdEventStart: body.stdEventStart, stdEventEnd: body.stdEventEnd}).save()
    let calendarUser = await CalendarModel.findOne({id: body.id})
    if(!calendarUser)
       await new CalendarModel({id: body.id}).save()
       await CalendarModel.updateOne(
        {id: body.id},
        {$push: {events: newEvent}}
    )
    await res.send({msg: "done"})
  };

exports.deleteCalendarEvent = async (req, res)=>{
    const body = req.body;
    console.log(body)
    let event = await EventModel.findOne({$and :[{name: body.name}, {stdEventEnd: body.stdEventEnd}, {stdEventStart: body.stdEventStart}]})
    let eventID = event._id.toString()
    var ObjectId = require('mongodb').ObjectId;    
    var o_id = new ObjectId(eventID);
    console.log(eventID)
    const eventInCalendar = await CalendarModel.findOneAndUpdate(
        {id: 'B10901098'},
        {$pull: {events: o_id}}
    )
    await EventModel.deleteOne(event);
    await res.send({msg: "deleted"})
}



exports.getCalendarEvent = async (req, res) => {
    const id = req.query.id;
    let calendarUser = await CalendarModel.findOne({id: id})
    console.log(!calendarUser)
    console.log("hello")
    if(!calendarUser){
        await new CalendarModel({id: id}).save();
        await res.send({msg: "new User", events: calendarUser})
    }
    else{
        await res.send({events: await calendarUser.populate('events'), msg: "get Event"})
    }
}