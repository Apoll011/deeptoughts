- [ ] Keep the setting on fileter and display even on change screen


Perfect. Here's a detailed **implementation-focused TODO list** for the following blocks in your app: **Sketch**, **Calendar Event**, **Hidden Block**, **Timer**, **Link**, **Reflection Prompt**, and **Date/Time**. Each task includes key sub-features for MVP-level integration, keeping scalability in mind.

---

## ✅ TODO List: New Blocks for **DeepTHoughts**

---

### 🎨 Sketch Block

**Purpose**: Allow users to draw/write freely in a canvas area.

#### Core Tasks:

* [ ] Create `<SketchBlock />` component.
* [ ] Add canvas element with drawing capability (e.g., using [Fabric.js](http://fabricjs.com/) or native Canvas API).
* [ ] Add color and brush size selector.
* [ ] Add clear/reset button.
* [ ] Export canvas as image (to store in block data).
* [ ] Make it responsive (touch and mouse support).

#### Optional (Advanced):

* [ ] Save/load canvas state as JSON for editing.
* [ ] Stylus/pressure sensitivity support.

---

### 📅 Calendar Event Block

**Purpose**: Embed key events related to the journal entry.

#### Core Tasks:

* [ ] Create `<CalendarEventBlock />`.
* [ ] Input fields for:

    * [ ] Title
    * [ ] Date and Time
    * [ ] Description (optional)
* [ ] Optionally link to external calendar (future).
* [ ] Store data in note state (title, datetime, description).
* [ ] Display event summary in view mode.

#### Optional (Advanced):

* [ ] Integrate with Google Calendar API via OAuth.
* [ ] Notification/reminder toggle.

---

### 🔒 Hidden Block

**Purpose**: Allow private thoughts to be stored but hidden from casual viewing.

#### Core Tasks:

* [ ] Create `<HiddenBlock />`.
* [ ] Add toggle for **hide/show** content.
* [ ] Blur or collapse content by default.
* [ ] Display lock icon or “Private Thought” label when hidden.
* [ ] Optional: Add pin/password protection.

---

### ⏳ Timer Block

**Purpose**: Let users track durations or focus sessions.

#### Core Tasks:

* [ ] Create `<TimerBlock />`.
* [ ] Add start/pause/reset controls.
* [ ] Show running timer (hh\:mm\:ss).
* [ ] Store elapsed time in state.
* [ ] Optionally name the timer (e.g., "Reading", "Meditation").

#### Optional (Advanced):

* [ ] Countdown mode.
* [ ] Log historical timers in analytics view.

---

### 🔗 Link Block

**Purpose**: Add links with previews.

#### Core Tasks:

* [ ] Create `<LinkBlock />`.
* [ ] Input for URL.
* [ ] Validate and sanitize input.
* [ ] Fetch metadata for preview (title, thumbnail, description).
* [ ] Display preview card (use `open-graph` data or headless fetch).
* [ ] Make link open in new tab.

---

### 🧠 Reflection Prompt Block

**Purpose**: Guide users with questions for deeper journaling.

#### Core Tasks:

* [ ] Create `<ReflectionPromptBlock />`.
* [ ] Add text area for response.
* [ ] Load random prompt from a static list.
* [ ] Option to shuffle/change prompt.
* [ ] Save prompt and response together in state.

#### Optional:

* [ ] Allow user to add custom prompts.
* [ ] Daily random prompt suggestion on new entry.

---

### 📆 Date/Time Block

**Purpose**: Manually set or edit the date/time of a memory block.

#### Core Tasks:

* [ ] Create `<DateTimeBlock />`.
* [ ] Use date-time picker (e.g., `@headlessui/react` + `date-fns`).
* [ ] Default to current timestamp.
* [ ] Store ISO timestamp in state.
* [ ] Display friendly format (“August 4, 2025 — 10:30 PM”).