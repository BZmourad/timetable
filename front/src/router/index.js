import { createRouter, createWebHistory } from 'vue-router'
import TimetableList from '../views/TimetableList.vue'
import CreateTimetable from '../views/CreateTimetable.vue'
import EditTimetable from '../views/EditTimetable.vue'
import ShowTimetable from '../views/ShowTimetable.vue'
import FetXmlImporter from '../views/FetXmlImporter.vue'
import TestTimetable from '../views/TestTimetable.vue'

const routes = [
  {
    path: '/',
    name: 'TimetableList',
    component: TimetableList
  },
  {
    path: '/create',
    name: 'CreateTimetable',
    component: CreateTimetable
  },
  {
    path: '/edit/:id',
    name: 'EditTimetable',
    component: EditTimetable,
    props: true
  },
  {
    path: '/show/:id',
    name: 'ShowTimetable',
    component: ShowTimetable,
    props: true
  },
  {
    path: '/upload',
    name: 'FetXmlImporter',
    component: FetXmlImporter
  },
  {
    path: '/test',
    name: 'TestTimetable',
    component: TestTimetable
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
