using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addedFKtoAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_medical_records_PatientId",
                table: "medical_records");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "appointments",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateIndex(
                name: "IX_medical_records_PatientId",
                table: "medical_records",
                column: "PatientId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_ProviderId",
                table: "appointments",
                column: "ProviderId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_users_ProviderId",
                table: "appointments",
                column: "ProviderId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_users_ProviderId",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "IX_medical_records_PatientId",
                table: "medical_records");

            migrationBuilder.DropIndex(
                name: "IX_appointments_ProviderId",
                table: "appointments");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "appointments",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldDefaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_medical_records_PatientId",
                table: "medical_records",
                column: "PatientId");
        }
    }
}
