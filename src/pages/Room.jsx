import React, {useState, useEffect} from 'react'
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig'
import { ID, Query, Permission, Role} from 'appwrite';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';
import {Trash2} from 'react-feather'


const Room = () => {
    const [messageBody, setMessageBody] = useState('')
    const [messages, setMessages] = useState([])
    const {user} = useAuth()


    useEffect(() => {
        getMessages();
      // subscribe an unsubscribe a appwrite realtime fun that allows to subscirbe to channels eg databses,documents in here
        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => { //unsubscribe first cuz we have subscribes twice

            if(response.events.includes("databases.*.collections.*.documents.*.create")){
                console.log('A MESSAGE WAS CREATED')
                setMessages(prevState => [response.payload, ...prevState])//same as delete and ...notmessages and prevstate cuz use state is an empty array 
            }

            if(response.events.includes("databases.*.collections.*.documents.*.delete")){
                console.log('A MESSAGE WAS DELETED!!!')
                setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))//filtered out the msg which was deleted
            }
        });

        console.log('unsubscribe:', unsubscribe)
      
        return () => {
          unsubscribe();
        };
      }, []);

//await ES8 feature to write asynchronous code 
//setmessages used to render the messages
//querying database items
    const getMessages = async () => {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(100),
            ] //query(a class) used to sort messages in descending form and linit func for limiting msgs shown
        )
        console.log(response.documents)
        setMessages(response.documents)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()//for preventing autorefreshing 
        console.log('MESSAGE:', messageBody)

        const permissions = [
            Permission.write(Role.user(user.$id)),//assigning permission to user
          ]

        const payload = {//submiting string in usestate as payload to .createdoc
            user_id:user.$id,
            username:user.name,
            body:messageBody
        }

        const response = await databases.createDocument(
                DATABASE_ID, 
                COLLECTION_ID_MESSAGES, 
                ID.unique(), 
                payload,
                permissions
            )

        console.log('RESPONSE:', response)

        // setMessages(prevState => [response, ...prevState])

        setMessageBody('')

    }

    const deleteMessage = async (id) => {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, id);
        //setMessages(prevState => prevState.filter(message => message.$id !== message_id))
     } 

  return (
    <main className="container">
        <Header/>{/*for login logout and welcome */}
        <div className="room--container">
        
        <form id="message--form" onSubmit={handleSubmit}> 
        {/* //form used as css for message body on submit*/}
            <div>
                <textarea 
                    required 
                    maxlength="250"
                    placeholder="Say something..." 
                    onChange={(e) => {setMessageBody(e.target.value)}}//onchange use the value user is typing and send it to setmessagebody
                    value={messageBody}
                    ></textarea>
            </div>

            <div className="send-btn--wrapper">
                <input className="btn btn--secondary" type="submit" value="send"/>
            </div> {/*buttons for submit and send */}
        </form>
        
        
        
        <div>
            {messages.map(message => (
                //header will store senders name
                //span used to print the body of username attribute
                <div key={message.$id} className={"message--wrapper"}>
                    <div className="message--header">
                        <p> 
                            {message?.username ? (
                                <span> {message?.username}</span>
                            ): (
                                'Anonymous user'
                            )}
                         
                            <small className="message-timestamp"> {new Date(message.$createdAt).toLocaleString()}</small>
                        </p>

                        {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                            <Trash2 className="delete--btn" onClick={() => {deleteMessage(message.$id)}}/>//calling deletemessage function and not showing trash icon to other user msgs
                            
                        )}{/*trash2 a react feather icon(just a img)*/}
                    </div>

                    <div className={"message--body" + (message.user_id === user.$id ? ' message--body--owner' : '')}>
                        <span>{message.body}</span>
                        
                    </div>
                        
            
                </div>
            ))}
        </div>
        </div>
    </main>
  )
}

export default Room
