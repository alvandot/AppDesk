<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // SQLite doesn't support MODIFY COLUMN with ENUM, so we skip for SQLite
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        // Update enum untuk activity_type dengan nilai baru
        DB::statement("ALTER TABLE ticket_activities MODIFY COLUMN activity_type ENUM(
            'received',
            'hit_the_road',
            'arrived',
            'start_working',
            'end_working',
            'finish_job',
            'need_part',
            'completed',
            'revisit',
            'end_case',
            'status_change',
            'note',
            'on_the_way'
        ) NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // SQLite doesn't support MODIFY COLUMN with ENUM, so we skip for SQLite
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        // Rollback ke enum lama
        DB::statement("ALTER TABLE ticket_activities MODIFY COLUMN activity_type ENUM(
            'received',
            'on_the_way',
            'arrived',
            'start_working',
            'need_part',
            'completed',
            'revisit',
            'status_change',
            'note'
        ) NOT NULL");
    }
};
