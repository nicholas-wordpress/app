import updateAdminBar from './app/middlewares/route/updateAdminBar'
import validateAdminPage from './app/middlewares/route/validateAdminPage'
import validateCompatibilityMode from './app/middlewares/route/validateCompatibilityMode'
import primeCache from './app/middlewares/route/primeCache'
import setPreloadWorker from './app/middlewares/setup/setPreloadWorker'

// This should be compiled and exported as a global object.
export {
	updateAdminBar,
	validateAdminPage,
	validateCompatibilityMode,
	primeCache,
	setPreloadWorker
}