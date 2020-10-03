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
* config_cron: https://crontab.guru/

## agenda
* repository: https://github.com/agenda/agenda

## bull
* repository: https://github.com/OptimalBits/bull
