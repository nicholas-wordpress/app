import updateAdminBar from './app/middlewares/route/updateAdminBar'
import validateAdminPage from './app/middlewares/route/validateAdminPage'
import validateCompatibilityMode from './app/middlewares/route/validateCompatibilityMode'
import primeCache from './app/middlewares/route/primeCache'

// This should be compiled and exported as a global object.
export {
	updateAdminBar,
	validateAdminPage,
	validateCompatibilityMode,
	primeCache
}