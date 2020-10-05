# SCHEDULE TASKS

## reports (save task results, to facilitate debugging)

* log
```ts
interface LogData {
	// adonis js logger
	level: string;
	message: string;
	// custom
	report_message?: string;
	report_success:?: any;
	report_error?: any;
}
```

## cron jobs
* repository: https://github.com/kelektiv/node-cron
* db: None

## agenda
* repository: https://github.com/agenda/agenda
* db: mongo

## bull
* repository: https://github.com/OptimalBits/bull
* db: redis

## bee-queue
* repository: https://github.com/bee-queue/bee-queue
* db: redis
