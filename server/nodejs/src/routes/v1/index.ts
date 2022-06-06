import { Router } from 'express'
import auth from '../auth'
import users from '../users'
import categories from '../categories'
import items from '../items'
import departments from '../departments'
import positions from '../positions'

const router = Router()

router.use('/auth', auth)
router.use('/users', users)
router.use('/items', items)
router.use('/categories', categories)
router.use('/positions', positions)
router.use('/departments', departments)
export default router