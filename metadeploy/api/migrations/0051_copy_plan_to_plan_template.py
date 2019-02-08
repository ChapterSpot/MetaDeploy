# Generated by Django 2.1.5 on 2019-02-07 20:53

from django.db import migrations


def forwards(apps, schema_editor):
    Plan = apps.get_model("api", "Plan")
    PlanTemplate = apps.get_model("api", "PlanTemplate")
    for plan in Plan.objects.all():
        plan_template = PlanTemplate.objects.create(
            preflight_message=plan.preflight_message,
            post_install_message=plan.post_install_message,
        )
        plan.plan_template = plan_template
        plan.save()


def backwards(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [("api", "0050_add_plan_template")]

    operations = [migrations.RunPython(forwards, backwards)]
