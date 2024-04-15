
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bgtestImage from '../public/hero.webp';
import React, { useEffect } from "react";
import Router from 'next/router'
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { IoMdEyeOff } from "react-icons/io";
import { Capacitor } from '@capacitor/core';
import { userLogin } from '../src/AllFunction'
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      timer: 5,
      start: false,
      file: null, count: 0,
    }

  }

  playText = async () => {
    if (this.state.email) {
      if ('speechSynthesis' in window) {

        let msg = new window.SpeechSynthesisUtterance()
        let voicesArray = speechSynthesis.getVoices()
        msg.voice = voicesArray[2]
        msg.text = this.state.email
        msg.lang = "hi-IN";
        speechSynthesis.speak(msg)
        /// alert("Played 1")
      }
      else {
        if (Capacitor.isNativePlatform()) {
          // do something

          await TextToSpeech.speak({
            text: this.state.email,
            lang: 'hi-IN',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            category: 'ambient',
          });
          //alert("Played 2")
        }
        else {
          await TextToSpeech.speak({
            text: this.state.email,
            lang: 'hi-IN',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            category: 'ambient',
          });
          //  alert("Played 0")
        }
      }



    } else {
      toast.warn("Please Enter Text....")
    }
  }

  componentDidMount() {

    setInterval(() => {
      if (this.state.start && this.state.timer) {
        this.playText()
      }
    }, (parseInt(this.state.timer) * 1000))

  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    return (
      <div>

        <ToastContainer />
        <main style={{ backgroundImage: `url(${bgtestImage.src})`, backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }} className='h-screen flex justify-center items-center px-6 py-12'>
          {/*} <button type="button" className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={()=>{playsound()}} >PlaySound</button>*/}
          <div className=" backdrop-blur-[5px] border-2 border-#ffffff-600 rounded-[12px] bg-white/10 flex min-h-auto flex-col justify-center px-6 py-12 lg:px-8 shadow-lg" >
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Text To Speech App</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6"  >
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Enter Text</label>
                  <div className="mt-2">
                    <input maxLength={20} id="email" name="email" type="text" onChange={(evt) => { this.setState({ email: String(evt.target.value).toUpperCase() }) }} value={this.state.email ? String(this.state.email).toUpperCase() : ""} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label for="quantity-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Set Timer:</label>



                  </div>
                  <div className="mt-2 max-w-xs mx-auto">
                    <div class="relative flex items-center max-w-[8rem]">
                      <button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none" onClick={() => { this.setState({timer:(parseInt(this.state.timer) - 1) }) }}>
                        <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
                        </svg>
                      </button>
                      <input type="text" id="quantity-input" data-input-counter data-input-counter-min="1" data-input-counter-max="50" aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-4 " placeholder="999" name="timer" value={this.state.timer} required />
                      <button type="button" id="increment-button" data-input-counter-increment="quantity-input" class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none" onClick={() => { this.setState({timer:(parseInt(this.state.timer) + 1) }) }}>
                        <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <button type="button" className="flex w-full justify-center bg-indigo-600 rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => { this.setState({ start: !(this.state.start) }) }}> {this.state.start ? "Pause" : "Play"}</button>
                </div>
              </form>

              {/* <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Start a 14 day free trial</a>
  </p>*/}
            </div>
          </div >
        </main >
      </div>


    );
  }
}
