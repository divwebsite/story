// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 70)
      const end = start + Math.floor(Math.random() * 70)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

const phrases = [
    'As I walked down the dimly lit hallway of the abandoned asylum, I could not shake the feeling that someone or something was following me.',
    'Every step I took seemed to echo and amplify the creaking of the floorboards beneath my feet.',
    'Suddenly, I heard a faint whisper in my ear, and I turned around to find that I was completely alone.',
    'As I continued walking, I saw a shadowy figure in the distance, which disappeared as soon as I got closer.',
    'The hairs on the back of my neck stood up as I felt a cold breeze rush past me, even though the windows were all boarded up.',
    'As I finally reached the end of the hallway, I was startled by a loud banging sound, and I realized that the door was now locked.',
    'I turned around, only to see a pair of glowing eyes staring back at me from the darkness.',
    'My heart racing, I frantically searched for a way out, but all the windows were now barred and the doors were all locked.',
    'And then, as the glowing eyes drew closer, I realized that I was never going to escape this asylum alive.',
    'Come back tommorow for a new story',
    'Story will repeat in 5 seconds'
]

const el = document.querySelector('.text')
const fx = new TextScramble(el)

let counter = 0
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 5000)
  })
  counter = (counter + 1) % phrases.length
}

next()