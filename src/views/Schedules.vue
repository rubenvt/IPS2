<template>
  <div class="main-content">
    <Header title="Schedules" />
    <div class="content-area">
      <div class="content-panel" style="width: 250px;">
        <div class="panel-header">
          <div class="panel-title">Schedules</div>
          <div class="panel-actions">
            <button><i class="fas fa-plus"></i></button>
            <button><i class="fas fa-ellipsis-v"></i></button>
          </div>
        </div>
        <ul class="sidebar-menu">
          <li 
            v-for="schedule in schedules" 
            :key="schedule.id" 
            class="sidebar-item" 
            :class="{ active: selectedScheduleId === schedule.id }"
            @click="selectedScheduleId = schedule.id"
          >
            <i class="fas fa-calendar-alt"></i>
            <span>{{ schedule.title }}</span>
          </li>
        </ul>
      </div>
      <div class="content-panel">
        <div class="panel-header">
          <div class="panel-title">Calendar View</div>
          <div class="panel-actions">
            <button @click="prevMonth"><i class="fas fa-chevron-left"></i></button>
            <span class="month-display">{{ currentMonthName }} {{ currentYear }}</span>
            <button @click="nextMonth"><i class="fas fa-chevron-right"></i></button>
            <button @click="resetToCurrentMonth"><i class="fas fa-sync"></i></button>
          </div>
        </div>
        <div class="calendar">
          <div class="calendar-header">
            <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
          </div>
          <div class="calendar-body">
            <div 
              v-for="(day, index) in calendarDays" 
              :key="index"
              class="calendar-day" 
              :class="{ 
                'other-month': day.otherMonth,
                'today': day.isToday,
                'has-events': day.events && day.events.length > 0
              }"
            >
              <div class="day-number">{{ day.day }}</div>
              <div class="day-events">
                <div 
                  v-for="event in day.events" 
                  :key="event.id"
                  class="day-event"
                  :style="{ backgroundColor: event.color }"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Header from '../components/Header.vue'

const schedules = ref([
  { id: 1, title: 'Company Announcements' },
  { id: 2, title: 'Product Showcase' },
  { id: 3, title: 'Cafeteria Menu' },
  { id: 4, title: 'Welcome Presentation' }
])

const selectedScheduleId = ref(1)
const currentDate = ref(new Date())
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const events = ref([
  { id: 1, title: 'Company Announcements', date: new Date(2023, 9, 3), color: '#3498db' },
  { id: 2, title: 'Product Showcase', date: new Date(2023, 9, 5), color: '#9b59b6' },
  { id: 3, title: 'Cafeteria Menu', date: new Date(2023, 9, 8), color: '#2ecc71' },
  { id: 4, title: 'Welcome Presentation', date: new Date(2023, 9, 10), color: '#f39c12' },
  { id: 5, title: 'Company Announcements', date: new Date(2023, 9, 12), color: '#3498db' },
  { id: 6, title: 'Product Showcase', date: new Date(2023, 9, 15), color: '#9b59b6' },
  { id: 7, title: 'Cafeteria Menu', date: new Date(2023, 9, 18), color: '#2ecc71' },
  { id: 8, title: 'Welcome Presentation', date: new Date(2023, 9, 21), color: '#f39c12' }
])

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' })
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // First day of the month
  const firstDay = new Date(year, month, 1)
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0)
  
  // Days from previous month to fill the first week
  const daysFromPrevMonth = firstDay.getDay()
  // Total days in the current month
  const daysInMonth = lastDay.getDate()
  
  const today = new Date()
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year
  
  const days = []
  
  // Add days from previous month
  const prevMonth = new Date(year, month, 0)
  const prevMonthDays = prevMonth.getDate()
  
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      otherMonth: true,
      isToday: false,
      events: []
    })
  }
  
  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const dayEvents = events.value.filter(event => 
      event.date.getDate() === i && 
      event.date.getMonth() === month && 
      event.date.getFullYear() === year
    )
    
    days.push({
      day: i,
      otherMonth: false,
      isToday: isCurrentMonth && today.getDate() === i,
      events: dayEvents
    })
  }
  
  // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      otherMonth: true,
      isToday: false,
      events: []
    })
  }
  
  return days
})

function prevMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

function nextMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

function resetToCurrentMonth() {
  currentDate.value = new Date()
}

onMounted(() => {
  // Initialize to current month
  currentDate.value = new Date()
})
</script>

<style scoped>
.month-display {
  margin: 0 10px;
  font-weight: 500;
  min-width: 120px;
  text-align: center;
}

.calendar {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.weekday {
  padding: 10px;
  text-align: center;
  font-weight: 500;
  color: #64748b;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  flex: 1;
}

.calendar-day {
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  min-height: 100px;
  padding: 5px;
  position: relative;
}

.day-number {
  font-weight: 500;
  margin-bottom: 5px;
}

.other-month {
  background-color: #f8fafc;
  color: #94a3b8;
}

.today {
  background-color: #e0f2fe;
}

.today .day-number {
  color: #0284c7;
  font-weight: 600;
}

.has-events {
  background-color: #f0fdf4;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.day-event {
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 11px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #1e293b;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-item:hover {
  background-color: #f1f5f9;
}

.sidebar-item.active {
  background-color: #e0f2fe;
  color: #0284c7;
}

.sidebar-item i {
  margin-right: 12px;
  width: 20px;
  text-align: center;
}
</style>
