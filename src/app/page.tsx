import { DoorOpen } from "lucide-react";

export default function Home() {
	return (
		<div className="relative h-screen w-screen flex items-center justify-center">
			{/* Exit Button */}
			<button className="absolute top-4 right-4 border border-gray-400 rounded-md p-2 hover:bg-gray-200">
				{/* Your Exit Icon here */}
				<DoorOpen />
			</button>
			
			{/*
				Our Pomodoro Time and controls will be placed inside the container below.
				Always remember, when we want to layout items vertically inside a container,
				we need to use flex-col.
			*/}
			<div
				className="flex flex-col items-center justify-center rounded-lg shadow-md p-8 mx-8 my-16 w-600"
				style={{ maxWidth: "600px", backgroundColor: "#FAF9F6" }}
			>
				{/*
					Our app container will have a min-height of 500px, and max-height of 700px.
					This is to ensure that it will still look good on screens with smaller height dimensions.
				*/}
				
				{/*
					A button for the user to set their focus time in minutes.
				*/}
				<button
					id="btnSetFocusTime"
					className="mt-4 px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
				>
					Set Focus Time
				</button>
				
				{/* We will use a <div /> to act as a spacer between our content items. This helps to maintain a consistent layout. */}
				<div className="w-full h-6" />
				
				{/*
					A modal dialog for the user to set their focus time in minutes.
					We will later replace this with a KendoReact Dialog component.
				*/}
				<div id="dlgFocusTime" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-4 rounded shadow-md">
						<input type="number" min="1" max="60" placeholder="Minutes" id="tbFocusTimeMin" />
						<button id="btnSaveFocusTime">Save</button>
					</div>
				</div>
				
				<div className="flex flex-col items-center justify-center relative w-full h-full">
					{/* Progress Circle Wrapper */}
					<div className="w-[75%] max-w-[300px] aspect-square">
						<svg className="w-full h-full" viewBox="0 0 100 100">
							<circle cx="50" cy="50" r="45" stroke="#D1D5DC" strokeWidth="10" style={{ opacity: 0.4 }} fill="none" />
							<circle
								cx="50"
								cy="50"
								r="45"
								stroke="#3f51b5"
								strokeWidth="10"
								fill="none"
								strokeDasharray="282.6"
								strokeDashoffset="50"
								style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
							/>
						</svg>
					</div>
					{/* Timer display */}
					<div className="absolute inset-0 flex items-center justify-center text-5xl font-bold" id="timerDisplay">
						25:00
					</div>
				</div>

				<div className="w-full h-6" /> {/* Separator */}
				
				{/* 
					Time Period Indicators 
						- These are a set of long-short bars to depict our Focus and Break 
							times.
						- We will turn this into a dynamic section when we put in the 
							coding logic.
						- I've set the width to 80% because it will look more natural.
						- The height has been set to h-1.5, which is 6px 
							(1rem * 1.5 * 0.25 = 6px)
						- This indicators will consist of the gutters (translucent) and 
							their corresponding indicators (opaque off-white).
				*/}
				<div className="flex w-[80%] max-w-[350px] h-1.5">
					<div className="h-full bg-gray-300 rounded-full w-1/4" style={{ opacity: .4 }}></div> {/* Focus - Long */}
					<div className="h-full bg-gray-300 rounded-full w-1/8 ml-2" style={{ opacity: .4 }}></div> {/* Break - Short */}
					<div className="h-full bg-gray-300 rounded-full w-1/4 ml-2" style={{ opacity: .4 }}></div> {/* Focus - Long */}
					<div className="h-full bg-gray-300 rounded-full w-1/8 ml-2" style={{ opacity: .4 }}></div> {/* Break - Short */}
					<div className="h-full bg-gray-300 rounded-full w-1/4 ml-2" style={{ opacity: .4 }}></div> {/* Focus - Long */}
					<div className="h-full bg-gray-300 rounded-full w-1/8 ml-2" style={{ opacity: .4 }}></div> {/* Break - Short */}
					<div className="h-full bg-gray-300 rounded-full w-1/4 ml-2" style={{ opacity: .4 }}></div> {/* Focus - Long */}
					<div className="h-full bg-gray-300 rounded-full w-1/8 ml-2" style={{ opacity: .4 }}></div> {/* Break - Short */}
				</div>
				
				<div className="w-full h-6" /> {/* Separator */}

				{/* Control Buttons */}
				<div className="flex items-center justify-center space-x-4"> 
					<button className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
						style={{ color: "#FAF9F6" }}
					>
						Start
					</button>
					<button 
						className="bg-red-400 hover:bg-red-600 font-bold py-2 px-4 rounded" 
						id="btnStop"
						style={{ color: "#FAF9F6" }}
					> 
						Stop
					</button>
				</div>
			</div>
		</div>
	);
}
