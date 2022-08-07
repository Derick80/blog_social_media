export default function NewPostRoute() {
	return (
		<div>
			<p>Add a Post</p>
			<form method='post'>
				<div>
					<label>
						Title: <input type='text' name='title'/>
					</label>
				</div>
				<div>
					<label>
						Body: <textarea name='body'/>
					</label>
				</div>
				<div>
					<button type='submit' className='button'>
						Add
					</button>
				</div>
			</form>
		</div>
	)
}